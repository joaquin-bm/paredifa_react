import TxtEditor from "../../../RegexEditor/TxtEditor";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState, useContext } from "react";
import ThemeContext from "../../../Context/ContextStates";
import DeleteAutomataModal from "../../DeleteDFAModal/DeleteAutomataModal";
import ThemeContextGeneral from "../../../Context/GeneralInfo";
import ThemeContextTr from "../../../Context/ContextTransitions";
import ThemeContextMsgInfo from "../../../Context/ContextMsg";
import ThemeContextMsg from "../../../Context/ContextMessage";
import ThemeContextStage from "../../../Context/StageInfo";
import axios from "axios";
import d3 from "d3";
/*
 *
 * Description:
 * Regex editor modal
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 *
 */
const RegexEditorModal = ({ show, handleClose }) => {
  const [manualName, setManualName] = useState(false);
  const [automatico, setAutomatico] = useState(false);
  const [re, setRe] = useState("");
  const [dfaName, setDfaName] = useState("");
  const [simplifyRe, setSimplifyRe] = useState(false);
  const [checkSintax, setCheckSintax] = useState(false);
  const {  setNodes } = useContext(ThemeContext);
  const { setEdge } = useContext(ThemeContextTr);
  const { setGeneralInfo } = useContext(ThemeContextGeneral);
  const { setMsgShow } = useContext(ThemeContextMsg);
  const { setMsgInfo } = useContext(ThemeContextMsgInfo);
  const { stageInfo } = useContext(ThemeContextStage);
  //delete modal if theres data
  const [showDeleteAutomata, setShowDeleteAutomata] = useState(false);
  const handleShowDeleteAutomata = () => setShowDeleteAutomata(false);
  //
  const [fetching, setFeching] = useState(false);

  /**  This method send the RE to be compiled by the prolog server
   * @returns void
   */
  const sendReToCompile = async () => {
    if (re.length !== 0) {
      const queryTodo = `
      {
        compileRE(re:{id:"${
          manualName ? dfaName : Date.now()
        }",checkSintax:${checkSintax},simpBeforeComp:${simplifyRe},RE:"${re}"}){
          nodes{
            name
            label
            initial
            final
          }
         
          edges{
            source
            target
            symbol
          }
          alphabet
        }
      }`;
      /* if (nodes.length > 0) {
        setShowDeleteAutomata(true);
      }
*/
      setFeching(true);
      const data = await axios.post(process.env.REACT_APP_BACK_END, {
        query: queryTodo,
      });

      const res = data.data.data.compileRE;
      console.log(res, "data");
      const edges = res.edges;
      const nodosNuevos = res.nodes;
      console.log(
        edges.map((e) => ({
          source: nodosNuevos.findIndex((nod) => nod.name === e.source),
          target: nodosNuevos.findIndex((nod) => nod.name === e.target),
          symbol: e.symbol,
        }))
      );
      setGeneralInfo({
        alphabet: res.alphabet,
        useDefault: false,
        wipeData: true,
        showAlphabetDefault: false,
        result: false,
      });

      setFeching(false);
      setRe("");
      handleClose();
      algo(
        nodosNuevos.map((nod) => ({
          ...nod,
          final: nod.final,
          start: nod.initial,
        })),
        edges.map((e) => ({
          source: nodosNuevos.findIndex((nod) => nod.name === e.source),
          target: nodosNuevos.findIndex((nod) => nod.name === e.target),
          symbol: e.symbol,
        }))
      );
    }
  };

  const algo = (nodos, ed) => {
    var w = stageInfo.w;
    // var h = 450;

    var dataset = {
      nodes: nodos,
      edges: ed,
    };

    const algo = {
      selected: false,

      width: 40,
      height: 40,
      type: "circle",
      shadowColor: "black",
      shadowBlur: 10,
      shadowOpacity: 0.6,
    };
    var force = d3.layout
      .force()
      .nodes(dataset.nodes)
      .links(dataset.edges)
      .size([w, 450])
      .linkDistance(120)
      .charge(-900)
      .gravity(0.2)
      .theta(0.8)
      .alpha(0.1)
      .start();

    force.on("end", () => {
      setMsgShow(true);
      setMsgInfo({
        bg: 'light',
        header: 'Information',
        body: 'Im done',
      });
    });

    force.on("tick", function () {
      const array = [];
      const arrayEdge = [];
      dataset.nodes.forEach((nod, index) =>
        array.push({
          id: index.toString(),
          name: nod.label,
          final: nod.final,
          start: nod.start,
          x: nod.x,
          y: nod.y,
          ...algo,
        })
      );

      dataset.edges.forEach((ed, index) =>
        arrayEdge.push({
          id: index.toString(),
          symbol: ed.symbol,
          type: "fixed",
          from: {
            id: `${array[ed.source.index].id}`,
            x: array[ed.source.index].x,
            y: array[ed.source.index].y,
          },
          to: {
            id: `${array[ed.target.index].id}`,
            x: array[ed.target.index].x,
            y: array[ed.target.index].y,
          },
        })
      );

      setNodes(array);
      setEdge(arrayEdge);
    });
  };

  /**  This method wipes current DFA in canvas
   * @returns void
   */
  const wipeDataAutomata = () => {
    setNodes([]);
    setEdge([]);
    setGeneralInfo({
      alphabet: [],
      useDefault: false,
      wipeData: true,
      showAlphabetDefault: false,
      result: false,
    });
    handleShowDeleteAutomata();
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            RegEx Mode
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="txtContainer">
          <TxtEditor
            manualName={manualName}
            setManualName={setManualName}
            automatico={automatico}
            setAutomatico={setAutomatico}
            setCheckSintax={setCheckSintax}
            checkSintax={checkSintax}
            setSimplifyRe={setSimplifyRe}
            simplifyRe={simplifyRe}
            dfaName={dfaName}
            setDfaName={setDfaName}
            re={re}
            setRe={setRe}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={sendReToCompile} variant="primary">
            Send
          </Button>
        </Modal.Footer>
      </Modal>
      <DeleteAutomataModal
        title="Are you sure you want to procede to send the RE? Your progess will be lost! "
        show={showDeleteAutomata}
        handleClose={handleShowDeleteAutomata}
        cbDelete={wipeDataAutomata}
      />
    </>
  );
};

export default RegexEditorModal;
