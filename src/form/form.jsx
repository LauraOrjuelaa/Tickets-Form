import { useState } from "react";
import './form.css'


function Form() {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState(1); 
    const [description, setDescription] = useState('');
    const [resolved, setResolved] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleTitleChange = (event) => {
        const { name, value } = event.target;
        setTitle(value);
        validateField(name, value);
    };
    
    const handlePriorityChange = (event) => {
        const { name, value } = event.target;
        setPriority(value);
        validateField(name, value);
    };

    const handleDescriptionChange = (event) => {
        const { name, value } = event.target;
        setDescription(value);
        validateField(name, value);
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setResolved(checked);
        validateField(name, checked);
    };

    const validateField = (name, value) => {
        let errors = { ...formErrors };

        switch (name) {
            case "title":
                if (value.length < 6 || value.length > 18) {
                    errors[name] = "Debe tener entre 6 y 18 caracteres";
                } else {
                    errors[name] = "";
                }
                break;
            case "description":
                if (value.length >= 30) {
                    errors[name] = "Debe tener máximo 30 caracteres";
                } else {
                    errors[name] = "";
                }
                break;
            default:
                errors[name] = "";
        }

        setFormErrors(errors);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            title,
            priority,
            description,
            resolved
        };

        try {
            // Envío de datos a la API
            const response = await fetch('http://localhost:3000/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            const newTicket = await response.json();
            console.log('Formulario enviado con éxito:', newTicket);

            //Resetear el formulario despues de enviado
            setTitle("");
            setPriority(1);
            setDescription("");
            setResolved(false);

        } catch (error) {
            console.error('Error al enviar formulario:', error.message);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Add Ticket</h2>
                <div className="form-group">
                    <label>Title</label>
                    <br />
                    <input type="text" name="title" value={title} onChange={handleTitleChange} />
                    {formErrors.title && <div className="error">{formErrors.title}</div>}
                </div>
                <div className="form-group">
                    <label>Priority</label>
                    <select name="priority" value={priority} onChange={handlePriorityChange}>
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={description} onChange={handleDescriptionChange} cols="25" rows="4" maxLength="30"/>
                    {formErrors.description && <div className="error">{formErrors.description}</div>}
                </div>
                <div className="checkbox">
                    <label htmlFor="resolved">Mark as Resolved</label>
                    <br />
                    <input type="checkbox" name="resolved" id="resolved" checked={resolved} onChange={handleCheckboxChange} />
                </div>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default Form;
