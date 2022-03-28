import React, {useEffect} from 'react';
import classes from './modal.module.css'

const Modal = ({children, isVisible, close}) => {
	useEffect(()=>{
		console.log("modal use effect");
	},[]);
	
	const styles = [classes.modal];
	if (isVisible) {
		styles.push(classes.active);
	}
	return(
		<div className={styles.join(' ')} onClick={() => close(false)}>
			<div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	)
}

export default Modal;