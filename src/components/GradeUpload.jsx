
import React, {useState} from 'react'

export default function GradeUpload({ onUpload }) {
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) return alert ("Por favor, selecciona un archivo CVS con notas.")
        onUpload ?. (file)
        alert("Archivo subido con éxito.")
        setFile(null)
        e.target.reset()
    }

  return (
    <div>
        <form className="w3-card w3-white rounded-3 p-3" onSubmit={handleSubmit}>
            <h6 className="mb-3">Subir archivo de notas (CSV)</h6>
            <div className="import-group">
                <input type="file" className="form-control" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
                <button className="btn btn-primary" type="submit" >
                    Subir
                </button>
            </div>
        <div className="form-text">Formato: estudiante_id, materia, nota, fecha</div>

        </form>
      
    </div>
  )
}
