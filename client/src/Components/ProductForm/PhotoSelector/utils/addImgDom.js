export default function addImgDom(dataUrl, id,delPhoto) {
    let div = document.createElement("div")
    div.id = id
    div.style.display = "flex"
    div.style.flexDirection = 'column'
    div.style.background = "#96bb7c";
    div.style.alignItems = 'center'

    let image = new Image();//se crea un objeto Dom de imagen
    image.id = 'imgPhoto' + id
    image.width = 100//medida de la imagen
    image.height = 100//medida de la imagen
    image.src = dataUrl//tomo parametro
    image.style.position = 'static'

    let btn = document.createElement("button")
    btn.className = 'del-Photo'
    btn.id = 'btnid' + id
    btn.style.position = 'absolute'
    btn.style.marginTop = '8rem'
    btn.textContent = "X"
    btn.style.padding = "0"
    btn.style.fontSize = "1rem"
    btn.style.color = "white"
    btn.style.height = '2rem'
    btn.style.width = '2rem'
    btn.style.border = 'solid'
    btn.style.backgroundColor = 'red'
    btn.style.opacity = "0.5"
    btn.style.borderWidth = '1px'
    btn.style.borderRadius = "10px"
    btn.style.borderColor = "white"
    btn.type = 'button'
    btn.onclick = () => { delPhoto(btn.parentNode) }
    let imageContainer = document.getElementById('imageContainer')//busca el contenedor para las imagenes
    imageContainer.appendChild(div)//agrega un objeto imagen al contenedor
    div.appendChild(btn)
    div.appendChild(image)
  }