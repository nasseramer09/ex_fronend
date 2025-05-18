import "./styles/usable_cards.css"
export default function Usable_cards(){

    return (
        <> 
    <div className="card-container">
        <div className="card-row">

            <div className="card">
                <h4> Skapa konto </h4>
                <p id="totalUppdrag"> empty </p>
            </div>

            <div className="card">
                <h4> Användare </h4>
                <p id="activaUppdrag"> empty </p>
            </div>

            <div className="card">
            <h4> Uppdrag </h4>
            <p id="ledigaBilar"> empty </p>
            </div>

        </div>
    </div>
  </>
    )
}