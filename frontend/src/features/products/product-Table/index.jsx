import React, { useEffect, useState, useCallback } from 'react';
import { Input, Space, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { productActions } from '../../slice';
import { selectProducts, selectTotalProducts } from '../../selectors';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../base/constants/routes';

const { Search } = Input;

const ProductTable = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const totalProducts = useSelector(selectTotalProducts);
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: totalProducts,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = useCallback(
    debounce((current, pageSize, search) => {
      let formattedParamString = `page=${current}&limit=${pageSize}`;
      if (search) {
        formattedParamString += `&search=${search}`;
      }
      dispatch(productActions.getProduct({ query: formattedParamString }));
    }, 300), // Adjust the debounce delay as needed
    [dispatch]
  );

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize, searchTerm);
  }, [fetchProducts, pagination.current, pagination.pageSize, searchTerm]);

  useEffect(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      total: totalProducts,
    }));
  }, [totalProducts]);

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: 1,
    }));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-5 bg-gray-50">
    <div className="flex justify-between items-center my-4">
      <div className="flex bg-white border rounded overflow-hidden">
        <span className="text-gray-500 sm:text-sm">
          <svg className="h-4 w-4 fill-current text-gray-500 m-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M10,20A10,10,0,1,1,20,10,10,10,0,0,1,10,20ZM10,4A6,6,0,1,0,16,10,6,6,0,0,0,10,4Z"/><path d="M21.707,20.293l-4.3-4.3A8.934,8.934,0,0,1,14,15.613V17l4.586,4.586a1,1,0,0,0,1.414-1.414Z"/>
          </svg>
        </span>
        <input type="text" placeholder="Search in product" className="p-2 w-full" />
      </div>
      <div>
        <button className="btn btn-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center" onClick={()=>navigate(ROUTES.ADD_PRODUCT)}>
          <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 5H6v14h12V9h-5V5zm3 5V7h-3v3h3zm-1 2h-8v2h8v-2zm0 4h-8v2h8v-2z"/></svg>
          Add Product
        </button>
        <button className="btn mx-2 btn-secondary bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          Import CSV
        </button>
      </div>
    </div>
    <div className="overflow-x-auto bg-white">
    <div>
      <Search
        placeholder="Search by name"
        onChange={(e) => handleSearch(e.target.value)}
        value={searchTerm}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={products}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        onChange={handleTableChange}
      />
    </div>
    </div>
    </div>
  );
};

export default ProductTable;
