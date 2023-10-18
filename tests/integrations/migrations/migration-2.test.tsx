import fs from 'fs';
import path from 'path';
import { migrateWallets } from '../../../src/renderer/shared/api/storage/migration/migration-2';
import Dexie from 'dexie';

/**
 * Storage integration tests
 *
 * @group integration
 * @group migrations
 */

describe('migrateWallets', () => {
  let db: Dexie;

  beforeEach(async () => {
    db = new Dexie('spektr');

    const dirPath = path.join(__dirname, './v180');
    const files = fs.readdirSync(dirPath);

    let schema: { [key: string]: string } = {};
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const keys = Object.keys(data[0]).join(',');

      const tableName = path.basename(file, path.extname(file));
      schema[tableName] = keys;
      db.version(170).stores(schema);
    }
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const tableName = path.basename(file, path.extname(file));
      await db.transaction('rw', (db as any)[tableName], async () => {
        await (db as any)[tableName].bulkPut(data);
      });
    }
  });

  it('should migrate wallets correctly', async () => {
    await db.transaction('rw', ['accounts', 'wallets', 'multisigEvents'], async (transaction) => {
      // Perform operations on the 'storeName' table here
      await migrateWallets(transaction);
    });

    // Now check that the data in the database is as expected
    // This might involve checking that certain records exist, or that they have certain properties
    const dbAccounts = await db.table('wallets').toArray();

    // Now check that the data in the database is as expected
    // This might involve checking that certain records exist, or that they have certain properties
    dbAccounts.forEach((account) => {
      // Add your assertions here
      // For example, you might check that the account has a certain property
      expect(account).toHaveProperty('walletId');
    });
  });

  afterEach(async () => {
    await db.delete();
  });
});
