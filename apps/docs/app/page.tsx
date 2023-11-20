"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Brand, Category, Product, ProductColor } from "../../../packages/model/model";
import axios from "axios";
import Navbar from "./Navbar";

type SearchParams = {
  page: number;
  Size: number;
  brandId?: string; // Assuming you'll use the ID of the brand
  categoryId?: string; // Assuming you'll use the ID of the category
  productName?: string;
  productColor?: string;
};

export default function Page(): JSX.Element {


  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const pageNumber = page + 1;
      const productsResponse = await axios.get('http://localhost:8080/products', {
        params: {
          page: pageNumber,
          size: rowsPerPage,
        },
      });
      setProducts(productsResponse.data.data);
      const categoriesResponse = await axios.get('http://localhost:8080/category');
      setCategories(categoriesResponse.data);
      const brandsResponse = await axios.get('http://localhost:8080/brand');
      setBrands(brandsResponse.data);
      const colorsResponse = await axios.get('http://localhost:8080/product-color');
      setColors(colorsResponse.data);
      setTotalRows(productsResponse.data.total)
    };
    fetchData();
  }, [page, rowsPerPage]);

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleBrandChange = (event: any) => {
    setSelectedBrand(event.target.value);
  };

  const handleColorChange = (event: any) => {
    setSelectedColor(event.target.value);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };


  const handleOrder = (product: Product) => () => {
    const { id, name, color } = product;
    const res = axios.post('http://localhost:8080/purchase', {
      productId: id,
      productName: name,
      productColor: color.color,
      orderDate: new Date(),
    });
    router.push('/purchase');
        
  }



  const handleSearch = async () => {
    let productNameFormatted = productName.replace(/\+/g, '%20').trim();
    productNameFormatted = productNameFormatted.endsWith('%20')
      ? productNameFormatted.substring(0, productNameFormatted.length - 3)
      : productNameFormatted;

    let params = {
      page: 1,
      size: 10,
      brandId: selectedBrand || undefined,
      categoryId: selectedCategory || undefined,
      productName: productNameFormatted || undefined,
      colorId: selectedColor || undefined,
    };

    if (selectedBrand) params.brandId = selectedBrand;
    if (selectedCategory) params.categoryId = selectedCategory;
    if (productNameFormatted) params.productName = productNameFormatted;
    if (selectedColor) params.colorId = selectedColor;
    const response = await axios.get('http://localhost:8080/products/filter', {
      params: params,
    });
    setPage(0);
    setTotalRows(response.data.total);

    if (response.data.data.length) {
      setProducts(response.data.data);
    } else {
      // set not found notification
      throw new Error();
    }
  };

  const handleCancel = async () => {
    setProductName('');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedColor('');

    const response = await axios.get('http://localhost:8080/products', {
      params: {
        page: 1,
        size: 8,
      },
    });
    setTotalRows(response.data.total)
    setProducts(response.data.data);

  };

  return (
    <>
      <Navbar />
      <div className="products-container">
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid  item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Product Name"
                    placeholder="Enter Product Name"
                    onChange={(e) => setProductName(e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      label="Select Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Brand</InputLabel>
                    <Select
                      value={selectedBrand}
                      onChange={handleBrandChange}
                      label="Select Brand"
                    >
                      {brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box>
                    <FormControl fullWidth>
                      <InputLabel sx={{ mb: 1 }}>Color</InputLabel>
                      <Select
                        value={selectedColor}
                        onChange={handleColorChange}
                        label="Select Color"
                      >
                        {colors.map((color) => (
                          <MenuItem key={color.id} value={color.id}>
                            <Chip sx={{ backgroundColor: color.color, color: color.color === 'Black' ? "white" : "black" }}
                              label={color.color} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                <div className="button-container">
                  <Button onClick={handleSearch} variant="contained" style={{ width: '50%' }}>Search Order</Button>
                  <Button onClick={handleCancel} variant="contained" style={{ width: '50%', background: '#DC3545' }}>Cancel</Button>
                </div>
                </Box>
            </Grid>
            <Grid item xs={12}>
              {
                products.length && (
                  <>
                    <Grid container spacing={20}>
                      {products?.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                          <Card sx={{ width: '100%', height: "auto" }}>
                            <CardContent>
                              <h2>{product.name}</h2>
                              <p style={{ fontWeight: "bolder" }}>RM {product.price}</p>
                              <p>
                                <span style={{
                                  display: 'inline-block',
                                  width: '15px',
                                  height: '15px',
                                  backgroundColor: product.color.color.toLocaleLowerCase(),
                                  border: '1px solid black',
                                  borderRadius: '50%',
                                  marginRight: '5px',
                                  verticalAlign: 'middle'
                                }}></span>
                                {product.color.color}
                              </p></CardContent>
                            <Button onClick={handleOrder(product)} variant="contained" color="primary"
                              fullWidth>
                              Place Order
                            </Button>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    <Box display="flex" justifyContent="center" mt={4}>
                      <TablePagination
                        rowsPerPageOptions={[8, 10, 25]}
                        component="div"
                        count={totalRows}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage} />
                    </Box>
                  </>
                )
              }
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}