import { useState } from 'react'
import './counter.css'
// Este es un componente

function MiComponente() {
    const [contador, setContador] = useState(0);

    return (
        <div style={{textAlign:'center', marginTop:'50px'}}>
            <button onClick={()=>setContador(contador+1)}>Incrementar</button>
            <p>Has hecho Click {contador} veces.</p>
        </div>
    );
}

export default MiComponente;