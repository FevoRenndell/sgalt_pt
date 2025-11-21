import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  config: path.resolve(__dirname, 'app/src/config/config.json'),
  'models-path': path.resolve(__dirname, 'app/src/models'),
  'seeders-path': path.resolve(__dirname, 'app/src/seeders'),
  'migrations-path': path.resolve(__dirname, 'app/src/migrations'),
};
