import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from backend import seed


class SeedTest(unittest.TestCase):
  def test_seed_is_atomic_and_runs_once(self):
    with tempfile.TemporaryDirectory() as directory:
      database = Path(directory) / "ce50.db"
      with sqlite3.connect(database) as connection:
        connection.executescript((Path(__file__).parents[1] / "docs" / "ce50_schema.txt").read_text())
      with patch.object(seed, "DB_PATH", database):
        seed.seedAll()
        with self.assertRaises(RuntimeError):
          seed.seedAll()
      with sqlite3.connect(database) as connection:
        self.assertEqual(connection.execute("SELECT COUNT(*) FROM teachers").fetchone()[0], 6)


if __name__ == "__main__":
  unittest.main()
