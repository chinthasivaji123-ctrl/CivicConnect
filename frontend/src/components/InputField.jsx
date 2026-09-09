function InputField({type,name,placeholder,value,onChange}){

return(

<input

className="register-input"

type={type}

name={name}

placeholder={placeholder}

value={value}

onChange={onChange}

/>

)

}


export default InputField;