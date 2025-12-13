// Interface for {{ModuleName}} entity
export interface I{{ModuleName}} {
  id: number | string;
  name: string;
  // Add more fields as needed
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creating {{ModuleName}}
export interface ICreate{{ModuleName}} {
  name: string;
  // Add more fields as needed
}

// Interface for updating {{ModuleName}}
export interface IUpdate{{ModuleName}} {
  name?: string;
  // Add more fields as needed
}

// Interface for {{ModuleName}} service response
export interface I{{ModuleName}}ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

