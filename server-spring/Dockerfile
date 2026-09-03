# Stage 1: build the JAR (needs JDK, Maven and your source code).
FROM --platform=$BUILDPLATFORM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

# Stage 2: run the JAR (JRE is enough)
FROM eclipse-temurin:25-jre
USER 1000
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 7777
ENV SPRING_PROFILES_ACTIVE=prod
CMD ["java", "-jar", "app.jar"]
