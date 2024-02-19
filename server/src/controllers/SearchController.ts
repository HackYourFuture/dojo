import { Request, Response } from "express";

interface SearchResponse {
  hits: SearchHits
}

interface SearchHits {
  data: SearchResult[],
  size: number
}

interface SearchResult {
  id: string,
  name: string,
}

export interface SearchControllerType {
  search(req: Request, res: Response): Promise<void>;
}

export class SearchController implements SearchControllerType {
  constructor() {}

  async search(req: Request, res: Response) {
    const searchQuery: string = req.query.q as string ?? "";
    const results = fakeData.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const response: SearchResponse = {
      hits: {
        data: results,
        size: results.length
      }
    };
    res.status(200).json(response);
  }
}

const fakeData: SearchResult[] = [
  { "id": "hy0eLu", "name": "Emma Smith" },
  { "id": "8RaPA2", "name": "William Brown" },
  { "id": "6Oe9Hc", "name": "Sophia Miller" },
  { "id": "Vr0DO6", "name": "Jane Wilson" },
  { "id": "D3pxPq", "name": "Emma Brown" },
  { "id": "E4ILKD", "name": "David Smith" },
  { "id": "P4Dh6N", "name": "Daniel Johnson" },
  { "id": "NcagOA", "name": "Olivia Moore" },
  { "id": "VyfWVd", "name": "William Johnson" },
  { "id": "dsA4A1", "name": "Olivia Smith" },
  { "id": "Ud7Irg", "name": "Emily Davis" },
  { "id": "bijWTm", "name": "Daniel Smith" },
  { "id": "beUBJa", "name": "John Taylor" },
  { "id": "Wy0I0w", "name": "John Johnson" },
  { "id": "jtQmle", "name": "Olivia Moore" },
  { "id": "EEWrLE", "name": "Emma Brown" },
  { "id": "Nfr8tM", "name": "William Miller" },
  { "id": "nC8qLw", "name": "Sophia Williams" },
  { "id": "q4vcZY", "name": "William Davis" },
  { "id": "L1pUwh", "name": "Michael Davis" },
  { "id": "K2Nz5p", "name": "William Williams" },
  { "id": "AzGVVD", "name": "William Taylor" },
  { "id": "AeLF86", "name": "Daniel Smith" },
  { "id": "t1W3ne", "name": "Jane Williams" },
  { "id": "uRlZOz", "name": "Michael Johnson" },
  { "id": "mM4o2J", "name": "Emily Williams" },
  { "id": "Sa7eDD", "name": "Olivia Smith" },
  { "id": "qAoQOd", "name": "Jane Wilson" },
  { "id": "lvmC54", "name": "Emma Jones" },
  { "id": "84iB8b", "name": "David Davis" },
  { "id": "bPimPu", "name": "Sophia Moore" },
  { "id": "917JLg", "name": "John Miller" },
  { "id": "nl2dwe", "name": "John Davis" },
  { "id": "QXGkCH", "name": "Sophia Jones" },
  { "id": "6JICgH", "name": "Michael Brown" },
  { "id": "IM8ZKS", "name": "David Williams" },
  { "id": "JO0gNp", "name": "Michael Miller" },
  { "id": "Iy38Z9", "name": "John Smith" },
  { "id": "1a3HaF", "name": "John Johnson" },
  { "id": "iyUUAx", "name": "Emily Taylor" },
  { "id": "HFNt6F", "name": "Jane Smith" },
  { "id": "K2j4C2", "name": "Michael Smith" },
  { "id": "ZAKLaT", "name": "Emma Moore" },
  { "id": "GAnceg", "name": "Daniel Miller" },
  { "id": "4wTy4I", "name": "Jane Johnson" },
  { "id": "vr5aSx", "name": "William Johnson" },
  { "id": "PEttf1", "name": "William Miller" },
  { "id": "yHSnpo", "name": "Emma Wilson" },
  { "id": "Ta8Mdm", "name": "William Williams" },
  { "id": "RME3LD", "name": "Michael Miller"
  }
]