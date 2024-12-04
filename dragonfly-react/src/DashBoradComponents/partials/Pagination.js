import React from 'react';

const Pagination = ({ rowsPerPage, totalRows, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
        {(totalRows>rowsPerPage) &&
            <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                <li key={number} className='page-item'>
                    <div onClick={() => paginate(number)} className='page-link' style={{cursor: "pointer"}}>
                    {number}
                    </div>
                </li>
                ))}
            </ul>
            </nav>
        }
        </>

    );
};

export default Pagination;
