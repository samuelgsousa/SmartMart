export class DeleteCategoryError extends Error {
    constructor(
      public message: string,
      public status: number,
      public detail?: any
    ) {
      super(message);
      this.name = "DeleteCategoryError";
    }
  }