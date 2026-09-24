package nl.hackyourfuture.dojoserver.filestorage;

import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;

import java.io.InputStream;
import java.net.URI;

@Service
@Slf4j
public class FileStorageService {
    private final FileStorageProperties fileStorageProperties;
    private final S3Client s3Client;

    public FileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageProperties = fileStorageProperties;

        var endpoint = URI.create(fileStorageProperties.endpoint());
        var region = Region.of(fileStorageProperties.region());
        var credentials = AwsBasicCredentials.create(
                fileStorageProperties.accessKeyId(),
                fileStorageProperties.accessKeySecret()
        );
        this.s3Client = S3Client.builder()
                .endpointOverride(endpoint)
                .region(region)
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .forcePathStyle(fileStorageProperties.forceBasePathStyle())
                .build();

        var bucket = fileStorageProperties.bucket();
        log.info("Initialized S3Client: endpoint: {}, region: {}, bucket: {}", endpoint, region, bucket);
        if (!fileStorageProperties.forceBasePathStyle() && endpoint.getHost().equals("localhost")) {
            log.warn("forceBasePathStyle set to 'false' on a localhost object storage. " +
                    "This will most likely not work. Set forceBasePathStyle to 'true'.");
        }
    }

    public void upload(String key, String contentType, InputStream fileStream, long size) {
        var request = PutObjectRequest.builder()
                .bucket(this.fileStorageProperties.bucket())
                .key(key)
                .contentType(contentType)
                .build();
        var body = RequestBody.fromInputStream(fileStream, size);
        this.s3Client.putObject(request, body);
        log.info("Uploaded file to '{}' ({}, {} bytes)", key, contentType, size);
    }

    public StoredFile download(String key) {
        var request = GetObjectRequest.builder()
                .bucket(this.fileStorageProperties.bucket())
                .key(key)
                .build();

        ResponseInputStream<GetObjectResponse> s3Response;
        try {
            s3Response = this.s3Client.getObject(request);
        } catch (NoSuchKeyException _) {
            throw new DojoNotFoundException("File not found");
        }

        var file = new StoredFile(s3Response,
                s3Response.response().contentType(),
                s3Response.response().contentLength()
        );
        log.debug("Downloaded file '{}' ({}, {} bytes)", key, file.contentType(), file.contentLength());
        return file;
    }

    public void delete(String key) {
        var request = DeleteObjectRequest.builder()
                .bucket(this.fileStorageProperties.bucket())
                .key(key)
                .build();
        log.info("Delete file '{}'", key);

        s3Client.deleteObject(request);
    }

    public void deleteAllWithPrefix(String prefix) {
        Assert.hasText(prefix, "An empty prefix would delete the whole bucket");
        var request = ListObjectsV2Request.builder()
                .bucket(this.fileStorageProperties.bucket())
                .prefix(prefix)
                .build();
        for (S3Object object : s3Client.listObjectsV2Paginator(request).contents()) {
            delete(object.key());
        }
    }

    @PreDestroy
    void close() {
        s3Client.close();
    }
}
