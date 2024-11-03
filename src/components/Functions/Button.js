import React from 'react'

function Button(props) {
  return (
    <div>
        <input type='button' onClick={props.onClick} id={props.id} value={props.value} class={props.class}></input>
    </div>
  )
}

export default Button;