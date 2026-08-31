import React, { useState, useEffect } from "react";


function Categories({categories, children, ...props}){

    return (

        <select {...props}>
            {children}
            {categories && (
                categories.map((categorie) => (
                    <option key={categorie.id} value={categorie.id}>{categorie.name}</option>
                ))
            )}
        </select>

    )
}

export default Categories

