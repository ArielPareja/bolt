import { Collection, CollectionFull, HttpRequest, Environment } from "../types";

class ApiService {
  private baseUrl = "http://localhost:3001/api"; // Configure your backend URL
  private useMockData = true; // Set to false when backend is available

  // Collections API
  async getCollections(): Promise<Collection[]> {
    if (this.useMockData) {
      return this.getMockCollections();
    }

    try {
      const response = await fetch(`${this.baseUrl}/collections`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching collections:", error);
      // Return mock data for development
      return this.getMockCollections();
    }
  }

  async getCollectionById(collectionId: string): Promise<CollectionFull> {
    if (this.useMockData) {
      return this.getMockCollectionFull(collectionId);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/collections/${collectionId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching collection:", error);
      // Return mock data for development
      return this.getMockCollectionFull(collectionId);
    }
  }

  async createCollection(
    collection: Omit<Collection, "_id" | "size" | "createdAt">
  ): Promise<Collection> {
    if (this.useMockData) {
      return {
        _id: Date.now().toString(),
        ...collection,
        size: 0,
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/collections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collection),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating collection:", error);
      // Return mock data for development
      return {
        _id: Date.now().toString(),
        ...collection,
        size: 0,
        createdAt: new Date().toISOString(),
      };
    }
  }

  async updateCollection(
    collectionId: string,
    updates: Partial<Collection>
  ): Promise<Collection> {
    if (this.useMockData) {
      const collections = this.getMockCollections();
      const collection = collections.find((c) => c._id === collectionId);
      if (!collection) {
        throw new Error("Collection not found");
      }
      return { ...collection, ...updates };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/collections/${collectionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating collection:", error);
      throw error;
    }
  }

  async deleteCollection(collectionId: string): Promise<void> {
    if (this.useMockData) {
      // In mock mode, we just simulate success
      return Promise.resolve();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/collections/${collectionId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      throw error;
    }
  }

  // Requests API
  async createRequest(
    collectionId: string,
    request: Omit<HttpRequest, "_id" | "createdAt" | "updatedAt">
  ): Promise<HttpRequest> {
    if (this.useMockData) {
      return {
        _id: Date.now().toString(),
        ...request,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/collections/${collectionId}/requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating request:", error);
      // Return mock data for development
      return {
        _id: Date.now().toString(),
        ...request,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async updateRequest(
    collectionId: string,
    requestId: string,
    updates: Partial<HttpRequest>
  ): Promise<HttpRequest> {
    if (this.useMockData) {
      const collection = this.getMockCollectionFull(collectionId);
      const request = collection.requests.find((r) => r._id === requestId);
      if (!request) {
        throw new Error("Request not found");
      }
      return { ...request, ...updates, updatedAt: new Date().toISOString() };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/collections/${collectionId}/requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  }

  async deleteRequest(collectionId: string, requestId: string): Promise<void> {
    if (this.useMockData) {
      // In mock mode, we just simulate success
      return Promise.resolve();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/collections/${collectionId}/requests/${requestId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  }

  // Search Collections
  async searchCollections(query: string): Promise<Collection[]> {
    if (this.useMockData) {
      const collections = this.getMockCollections();
      return collections.filter(
        (collection) =>
          collection.name.toLowerCase().includes(query.toLowerCase()) ||
          collection.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/collections/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error searching collections:", error);
      // Return filtered mock data for development
      const collections = this.getMockCollections();
      return collections.filter(
        (collection) =>
          collection.name.toLowerCase().includes(query.toLowerCase()) ||
          collection.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  // Environments API
  async getEnvironments(): Promise<Environment[]> {
    if (this.useMockData) {
      return this.getMockEnvironments();
    }

    try {
      const response = await fetch(`${this.baseUrl}/environments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching environments:", error);
      return this.getMockEnvironments();
    }
  }

  async createEnvironment(
    environment: Omit<Environment, "_id" | "createdAt" | "updatedAt">
  ): Promise<Environment> {
    if (this.useMockData) {
      return {
        _id: Date.now().toString(),
        ...environment,
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/environments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(environment),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating environment:", error);
      return {
        _id: Date.now().toString(),
        ...environment,
        createdAt: new Date().toISOString(),
      };
    }
  }

  async updateEnvironment(
    environmentId: string,
    updates: Partial<Environment>
  ): Promise<Environment> {
    if (this.useMockData) {
      const environments = this.getMockEnvironments();
      const environment = environments.find((e) => e._id === environmentId);
      if (!environment) {
        throw new Error("Environment not found");
      }
      return {
        ...environment,
        ...updates,
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/environments/${environmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating environment:", error);
      throw error;
    }
  }

  async deleteEnvironment(environmentId: string): Promise<void> {
    if (this.useMockData) {
      return Promise.resolve();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/environments/${environmentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting environment:", error);
      throw error;
    }
  }

  // Mock data for development
  private getMockCollections(): Collection[] {
    return [
      {
        _id: "1",
        name: "User Management API",
        description:
          "APIs for user registration, authentication, and profile management",
        size: 8,
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        _id: "2",
        name: "E-commerce API",
        description:
          "Product catalog, shopping cart, and order management endpoints",
        size: 12,
        createdAt: "2024-01-20T14:45:00Z",
      },
      {
        _id: "3",
        name: "Payment Gateway",
        description: "Payment processing and transaction management APIs",
        size: 6,
        createdAt: "2024-01-25T09:15:00Z",
      },
    ];
  }

  private getMockCollectionFull(collectionId: string): CollectionFull {
    const mockRequests: HttpRequest[] = [
      {
        _id: `${collectionId}_req_1`,
        collectionId: `${collectionId}_req_1`,
        name: "Get User Profile",
        method: "GET",
        url: "https://api.example.com/users/{{userId}}",
        headers: {
          Authorization: "Bearer {{token}}",
          "Content-Type": "application/json",
        },
        body: "",
        bodyType: "none",
        preScript: "",
        postScript: 'pm.environment.set("userId", pm.response.json().id);',
        tests:
          'pm.test("Status code is 200", function () {\n    pm.response.to.have.status(200);\n});',
        pathVariables: { userId: "123" },
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        _id: `${collectionId}_req_2`,
        collectionId: `${collectionId}_req_2`,
        name: "Create User",
        method: "POST",
        url: "https://api.example.com/users",
        headers: {
          "Content-Type": "application/json",
        },
        body: '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "password": "securePassword123"\n}',
        bodyType: "json",
        preScript: "",
        postScript: "",
        tests:
          'pm.test("User created successfully", function () {\n    pm.response.to.have.status(201);\n    pm.expect(pm.response.json()).to.have.property("id");\n});',
        createdAt: "2024-01-15T11:00:00Z",
        updatedAt: "2024-01-15T11:00:00Z",
      },
    ];

    return {
      _id: collectionId,
      name: "User Management API",
      description:
        "APIs for user registration, authentication, and profile management",
      requests: mockRequests,
      createdAt: "2024-01-15T10:30:00Z",
    };
  }

  private getMockEnvironments(): Environment[] {
    return [
      {
        _id: "1",
        name: "Development",
        variables: {
          baseUrl: "https://api-dev.example.com",
          token: "dev-token-123",
          userId: "1",
        },
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        _id: "2",
        name: "Production",
        variables: {
          baseUrl: "https://api.example.com",
          token: "prod-token-456",
          userId: "1",
        },
        isActive: false,
        createdAt: "2024-01-20T14:45:00Z",
      },
    ];
  }
}

export const apiService = new ApiService();
