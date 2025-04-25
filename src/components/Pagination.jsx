import React from 'react';

export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="d-flex justify-content-center align-items-center flex-wrap mt-4 gap-2">
      <button
        className="btn btn-outline-primary"
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
      >
        Anterior
      </button>

      <span className="mx-2">Página</span>

      <input
        type="number"
        min={1}
        max={totalPages}
        value={page}
        onChange={(e) => {
          const newPage = parseInt(e.target.value);
          if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
          }
        }}
        className="form-control text-center"
        style={{ width: '80px' }}
      />

      <span className="mx-2">de {totalPages}</span>

      <button
        className="btn btn-outline-primary"
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
      >
        Próxima
      </button>
    </div>
  );
}
