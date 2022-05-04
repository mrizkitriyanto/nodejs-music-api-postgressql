const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async getAlbums() {
    const query = {
      text: 'SELECT * FROM albums',
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  async getSongsByAlbumId(id) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE albumid = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async addAlbum({name, year}) {
    const id = 'album-' + nanoid();
    const query = {
      text: 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async editAlbumById(id, {name, year}) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async insertAlbumCover(albumid, coverurl) {
    const query = {
      text: 'UPDATE albums SET coverurl = $1 WHERE id = $2',
      values: [coverurl, albumid],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Cover gagal ditambahkan');
    }
  }
}

module.exports = AlbumsService;
