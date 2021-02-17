   /* ESTA FUNCION SOLO ENVIA EL ARCHIVO LLAMA A LA FUNCION
  makeUrl Y LE PASA EL ARCHIVO SELECIONADO, LO HICE CON ASYNC
  PORQUE ES UNA PROMESA */
import XLSX  from 'xlsx'

  export default async function processFile(file) {//la llamada es asincrona por si el archivo es muy grande
    try {
      const dataXLSX = await makeXlSX(file.files[0])
      return dataXLSX
     
    } catch (err) {

      alert('Se cancelo la carga o No se pudo leer la imagen seleccionada')
  
    }
  }
  
  function makeXlSX(file) {
    
    return new Promise((resolve, reject) => {
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			/* Parse data */
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_json(ws, {header:2});
			// /* Update state */
      resolve (data);
    };
		if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    })
  }

/* generate an array of column objects */
/* const make_cols = refstr => {
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
	for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
	return o;
}; */