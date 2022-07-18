import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import ThemeProvider from "../../theme";
import Axios from "axios";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
// import "./AdminDataUserTransactions.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import { Button as Tombol, DatePicker, version, Typography,Space } from "antd";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import Page from "../../components/admin/Page";
const { RangePicker } = DatePicker;
const { Title } = Typography;

const AdminTransaction = () => {
  const API_URL = process.env.REACT_APP_URL_API;
  const [startDate, setstartDate] = useState("");
  const [endDate, setendtDate] = useState("");
  const [month, setMonth] = useState("");
  const [dataTransaction, setDataTransaction] = useState([]);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();
  const selector = useSelector;
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = useState(false);

  const onHandleMonth = (date, monthPicked) => {
    setMonth(monthPicked);
  };

  const onHandleDateRange = (date, dateRange) => {
    setstartDate(dateRange[0]);
    setendtDate(dateRange[1]);
  };

  const ondateRangeSubmit = () => {
    console.log("Start Date :", startDate);
    console.log("End Date :", endDate);
    // if (startDate === "" && endDate === "") {
    //   alert("Select the date range before submit");
    // }
    const dateRange = {
      startDate: startDate,
      endDate: endDate,
    };
    console.log(dateRange);
    Axios.post(API_URL + `/admin/transactiondaterange`, dateRange)
      .then((respond) => {
        // save user data to global state
        dispatch({ type: "DATA_TRANSACTIONS", payload: respond.data });
        setDataTransaction(respond.data);
        console.log("data:", respond.data);
        setMonth("");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const ondMonthPickedSubmit = () => {
    const monthPicked = {
      month: month,
    };
    console.log(monthPicked);
    Axios.post(API_URL + `/admin/transactionbymonth`, monthPicked)
      .then((respond) => {
        // save user data to global state
        dispatch({ type: "DATA_TRANSACTIONS", payload: respond.data });
        // console.log(respond.data);
        // console.log(respond.data);
        setDataTransaction(respond.data);
        // console.log("data:", respond.data);
        // RESET STATE
        // month.current.value = "";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onButtonReset = () => {
    Axios.get(API_URL + `/admin/transaction`)
      .then((respond) => {
        // save user data to global state
        dispatch({ type: "DATA_TRANSACTIONS", payload: respond.data });

        console.log(respond.data);
        setDataTransaction(respond.data);
        console.log("data:", respond.data);

        setMonth("");
        setstartDate("");
        setendtDate("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle Approve
  const handleApprove = (id) => {
    console.log("id:", id);
    // const test = "Approved";
    // console.log()
    setStatus("Approved");
    // console.log(await getStatus())

    // solusi update state click pertama
    setStatus((statusbaru) => {
      console.log("test:", statusbaru);
      const newStatus = {
        id: id,
        status: statusbaru,
        month: month,
        startDate: startDate,
        endDate: endDate,
      };
      Axios.patch(API_URL + `/admin/changetransactionstatus`, newStatus)
        .then((respond) => {
          // save user data to global state
          dispatch({ type: "DATA_TRANSACTIONS", payload: respond.data });

          console.log(respond.data);
          setDataTransaction(respond.data);
          // console.log("data:", respond.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setOpen(false);

      return status;
    });
  };
  // Handle reject
  const handleReject = (id) => {
    console.log("id:", id);
    // const test = ;
    // console.log()
    setStatus("Rejected");
    // console.log(await getStatus())
    setStatus((statusbaru) => {
      console.log("test:", statusbaru);
      const newStatus = {
        id: id,
        status: statusbaru,
        month: month,
        startDate: startDate,
        endDate: endDate,
      };
      Axios.patch(API_URL + `/admin/changetransactionstatus`, newStatus)
        .then((respond) => {
          // save user data to global state
          dispatch({ type: "DATA_TRANSACTIONS", payload: respond.data });

          console.log(respond.data);
          setDataTransaction(respond.data);
          // console.log("data:", respond.data);
        })
        .catch((error) => {
          console.log(error);
        });

      return status;
    });
  };

  const columns = [
    {
      field: "id",
      identity: true,
      headerName: "ID",
      width: 50,
      // headerAlign: "center",
    },
    {
      field: "code",
      identity: true,
      headerName: "Code",
      width: 90,
      // headerAlign: "center",
    },
    {
      field: "customer_name",
      headerName: "Customer Name",
      width: 150,
      editable: false,
      // headerAlign: "center",
    },

    {
      field: "status",
      headerName: "Status",
      width: 170,
      editable: false,
      // headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <button className={"widgetLgButton " + params.row.status}>
              {params.row.status}
            </button>
          </>
        );
      },
    },
    {
      field: "total_payment",
      headerName: "Total Payment",
      width: 130,
      editable: false,
      valueFormatter: (params) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(params?.value),

      // headerAlign: "center",
    },
    {
      field: "date",
      headerName: "Payment Date",
      width: 200,
      editable: false,
      // moment.js
      valueFormatter: (params) => moment(params?.value).format("LLL"),
    },
    {
      field: "picture",
      headerName: "Payment Proof",
      width: 100,
      editable: false,
      // headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/transactions/" + params.row.id}>
              <button className="widgetSmButton">
                <VisibilityIcon className="widgetSmIcon" />
                Display
              </button>
            </Link>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      editable: false,
      // headerAlign: "center",
      renderCell: (params) => {
        return (
          <Space className="actionusers">
          <IconButton onClick={() => handleApprove(params.row.id)}>
           {/* <IconButton onClick={() => handleClickOpen(params.row.id)}> */}
           <CheckCircleSharpIcon style={{ color: "green" }} />
         </IconButton>

         <IconButton onClick={() => handleReject(params.row.id)}>
           <CancelSharpIcon style={{ color: "red" }} />
         </IconButton>
        
       </Space>
        );
      },
    },
  ];
  // () => handleDelete(params.row.id)

  useEffect(() => {
    Axios.get(API_URL + `/admin/transaction`)
      .then((respond) => {
        // console.log(respond.data);
        // console.log("data:", respond.data);

        // save user data to global state
        dispatch({ type: "DATA_TRANSACTIONS", payload: respond.data });

        setDataTransaction(respond.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const data = selector((state) => state.transactionsReducer);

  return (
    <ThemeProvider>
      <Page title="Transactions">
        <div className="App">
          <Title level={3}>Transactions</Title>
          <DatePicker
            onChange={onHandleMonth}
            style={{ margin: 8 }}
            picker="month"
          />
          <Tombol
            onClick={ondMonthPickedSubmit}
            type="primary"
            style={{ marginLeft: 8 }}
          >
            Submit
          </Tombol>
          <RangePicker onChange={onHandleDateRange} style={{ marginLeft: 8 }} />
          <Tombol
            onClick={ondateRangeSubmit}
            type="primary"
            style={{ marginLeft: 8 }}
          >
            Submit
          </Tombol>
          <Tombol
            onClick={onButtonReset}
            type="primary"
            style={{ marginLeft: 8 }}
          >
            Reset
          </Tombol>
        </div>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            // getRowId={(dataTransaction) => dataTransaction.id}
            rowHeight={100}
            rows={data}
            columns={columns}
            autoHeight={true}
            // checkboxSelection
            disableSelectionOnClick
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20, 100]}
            pagination
          />
        </Box>
      </Page>
    </ThemeProvider>
  );
};

export default AdminTransaction;
