import React , {useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css' 
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css' 
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, {textFilter, multiSelectFilter, selectFilter} from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css' 

 function DataList() {

    const accountTypeOptions = {
        'Type1': 'Type1',
        'Type2': 'Type2',
        'Type3': 'Type3'
    };

    const statusOptions = {
        'Processing': 'Processing',
        'Onboarded': 'Onboarded'
    };

    const columns= [
        {dataField:'name',text:'Name', filter: textFilter()},
        {dataField:'accounttype',text:'Account Type',formatter: cell => accountTypeOptions[cell], filter: selectFilter({ options: accountTypeOptions})},
        {dataField:'chargecode',text:'Charge Code'},
        {dataField:'status',text:'Status',formatter: cell => statusOptions[cell], filter: selectFilter({ options: statusOptions})},
        {dataField:'code',text:'Code'},
    ]

    const pagination = paginationFactory ( {
        page: 1,
        sizePerPage: 20,
        lastPageText: '>>',
        firstPageText: '<<',
        nextPageText: '>',
        prePageText: '<',
        showTotal: true,
        alwaysShowAllBtns: true,
        onPageChange: function (page, sizePerPage) {
            console.log('page',page);
            console.log('sizeperpage',sizePerPage);
        },
        onSizePerPageChange: function (page, sizePerPage) {
            console.log('page',page);
            console.log('sizeperpage',sizePerPage);
        } 
    });


    const [data, setData] = useState([]);
    // const [columns, setColumns] = useState([]);

  
    // process CSV data
    const processData = dataString => {
      const dataStringLines = dataString.split(/\r\n|\n/);
      const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      
      const list = [];
      for (let i = 1; i < dataStringLines.length; i++) {
        const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        if (headers && row.length == headers.length) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            let d = row[j];
            if (d.length > 0) {
              if (d[0] == '"')
                d = d.substring(1, d.length - 1);
              if (d[d.length - 1] == '"')
                d = d.substring(d.length - 2, 1);
            }
            if (headers[j]) {
              obj[headers[j]] = d;
            }
          }
  
          // remove the blank rows
          if (Object.values(obj).filter(x => x).length > 0) {
            list.push(obj);
          }
        }
      }
      
      // prepare columns list from headers
    //   const columns = headers.map(c => ({
    //     name: c,
    //     selector: c,
    //   }));
  
      setData(list);
    //   setColumns(columns);
    }
  
    // handle file upload
    const handleFileUpload = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        processData(data);
      };
      reader.readAsBinaryString(file);
    }
  
    return (
      <div>
        <h3> This is data from CSV file. </h3>
        
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
        />
        
        {/* <DataTable
          pagination
          highlightOnHover
          columns={columns}
          data={data}
        /> */}

        {/* <table>
            <tr>
                <th>Name</th>
                <th>Account Type</th>
                <th>Charge Code</th>
                <th>Status</th>
                <th>Code</th>
            </tr>
            {
                data && data.length>0 ?
                data.map( dat =>
                    <tr> 
                        <td>{dat.name}</td>   
                        <td>{dat.accounttype}</td>   
                        <td>{dat.chargecode}</td>   
                        <td>{dat.status}</td>      
                        <td>{dat.code}</td>    
                    </tr>
                )
                : 'Loading' 
            }
        </table> */}
        <BootstrapTable 
            bootstrap4
            keyField='name' 
            columns={columns} 
            data={data} 
            pagination={pagination}
            filter= {filterFactory()}
        />

      </div>
    );

 }
 export default DataList;
