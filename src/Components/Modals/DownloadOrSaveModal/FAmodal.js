import TodosModal from "./TodosModal";
import Message from "../../Message/Message";

/*
 *
 * Description:
 * Dfa stored in the database
 * Authors:
 *   Andres Alvarez Duran, ID: 117520958
 *   Joaquin Barrientos Monge, ID: 117440348
 *   Oscar Ortiz Chavarria, ID: 208260347
 *   David Zarate Marin, ID: 116770797
 *   Group: 01
 *   Schedule: 10am
 *
 */
const FAmodal = (props) => {
  return (
    <>
      <TodosModal
        handleShow={props.handleClose}
        show={props.show}
        FaM={true}
        title="DFA stored in the DB"
        setCurrentDfa={props.setCurrentDfa}
      />
      <Message />
    </>
  );
};

export default FAmodal;