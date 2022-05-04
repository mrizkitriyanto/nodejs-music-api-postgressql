/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    coverurl: {
      type: 'varchar(255)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
