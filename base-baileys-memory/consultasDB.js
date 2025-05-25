import { connection } from "./conexionDB.js";

//Consulta para verificar si un numero esta guardado o no.
export const estaRegistrado = async(numero) => {
    const [rows] = await connection.execute(
        'SELECT count(*) as total from telefonos where numero = ?', [numero]
    )
    console.log(rows[0].total)
    return rows[0].total;
}

//Consulta para guardar un numero que no ha sido guardado
export const guardarNumero = async (numero) => {
    numero = numero.slice(3)

    const numberExists = await estaRegistrado(numero)
 
    if(numberExists === 0){
            await connection.execute(
            'INSERT INTO telefonos (numero) VALUES (?)', [numero]
        )
    }
}

