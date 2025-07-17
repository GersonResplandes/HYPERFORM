import knex from 'knex';
import path from 'path';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connection: knex.Knex;

  private constructor() {
    const environment = process.env.NODE_ENV || 'development';
    const config = require(path.join(__dirname, '../../../knexfile.js'));
    this.connection = knex(config[environment]);
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getConnection(): knex.Knex {
    return this.connection;
  }

  public async closeConnection(): Promise<void> {
    await this.connection.destroy();
  }
}
