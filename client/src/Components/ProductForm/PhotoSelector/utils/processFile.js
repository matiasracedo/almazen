   /* ESTA FUNCION SOLO ENVIA EL ARCHIVO LLAMA A LA FUNCION
  makeUrl Y LE PASA EL ARCHIVO SELECIONADO, LO HICE CON ASYNC
  PORQUE ES UNA PROMESA */
  export default async function processFile(file) {//la llamada es asincrona por si el archivo es muy grande
    try {

      const dataUrl = await makeUrl(file)
      return dataUrl
     
    } catch (err) {

      alert('Se cancelo la carga o No se pudo leer la imagen seleccionada')
  
    }
  }
  
  
  /* ESTA FUNCION RECIBE UN FILE DE IMAGEN Y LO CONVIERTE EN LINK DE 64BIT
  LO HICE CON UN PROMESA POR SI EL ARCHIVO ES MUY GRANDE */
  function makeUrl(file) {
    return new Promise((resolve, reject) => {

      let reader = new FileReader();//este metodo parsea el archivo seleccionado

      reader.onload = () => {
        resolve(reader.result)//promesa exito => devuelve el archivo en el formato designado
      };
      reader.onerror = reject;

      reader.readAsDataURL(file.files[0])//designa el formato del archivo tipo dataUrl
    })
  }