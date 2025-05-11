export default function CreateAccount(){

return(
    <div className="container">
        <div className="left-section">
            <h1> Välkommen till MAHAM </h1>
            <p> Skapa konto </p>

            <div className="tabs">
            <span className="tab active"> Logga in </span>
            <span className="tab"> Registrera dig </span>
            </div>

            <form className="form">
           
                <div className="input-field"> 
                <input type="email" 
                placeholder="E-postadress" 

                required />

                <input type="password" 
                placeholder="Lösenord" 
                required />
                
                </div>
                <button type="submit" className="login-button"> Logga in </button>
            </form>
        </div>
        
        
    </div>
)}