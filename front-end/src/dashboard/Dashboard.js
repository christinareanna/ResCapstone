import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, cancelReservation } from "../utils/api";
import { previous, next, today } from '../utils/date-time';
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "./Reservations";
import Tables from "./Tables";
import { useHistory } from "react-router";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables().then(setTables)
    return () => abortController.abort();
  }

  function onCancel(reservation_id) {
    cancelReservation(reservation_id)
      .then(loadDashboard)
      .catch(setReservationsError);
  }

  function onFinish(table_id, reservation_id) {
    finishTable(table_id, reservation_id)
      .then(loadDashboard)
  }

  // CHANGE DATE HANDLERS
  const handlePreviousDateClick = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNextDateClick = () => {
    history.push(`dashboard?date=${next(date)}`);
  };

  const handleCurrentDateClick = () => {
    history.push(`dashboard?date=${today()}`)
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div className="btns">
        <button
          style={{ borderRadius: "15px", border: "none", marginRight: "5px" }}
          type="button"
          className="btn btn-info"
          data-testid="previous-date"
          onClick={handlePreviousDateClick}
        > Previous
        </button>
        <button
          style={{ borderRadius: "15px", border: "none", margin: "5px" }}
          type="button"
          className="btn btn-info"
          data-testid="previous-date"
          onClick={handleCurrentDateClick}
        > Today
        </button>
        <button
          style={{ borderRadius: "15px", border: "none", margin: "5px" }}
          type="button"
          className="btn btn-info"
          data-testid="next-date"
          onClick={handleNextDateClick}
        > Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <Reservations reservations={reservations} onCancel={onCancel} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <Tables onFinish={onFinish} tables={tables} />
    </main>
  );
}

export default Dashboard;
