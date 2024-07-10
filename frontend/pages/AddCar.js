import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  IconButton,
  ImageList,
  ImageListItem,
  Snackbar,
  Dialog,
  DialogContent,
} from "@mui/material";
import { PhotoCamera, Visibility, Delete } from "@mui/icons-material";
import MuiAlert from "@mui/material/Alert";
import { put } from "@vercel/blob";

export default function AddCar() {
  // State variables
  const [formData, setFormData] = useState({
    model: "",
    price: "",
    phone: "",
    maxPictures: 1,
    pictures: [],
  });
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    type: "error",
    message: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (imageFiles.length + newFiles.length > formData.maxPictures) {
      setAlert({
        type: "error",
        message: `You can upload a maximum of ${formData.maxPictures} images.`,
      });
      setOpen(true);
    } else {
      setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
      const newURLs = newFiles.map((file) => URL.createObjectURL(file));
      setImageURLs((prevURLs) => [...prevURLs, ...newURLs]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (formData.model.length < 3) {
      setAlert({
        type: "error",
        message: "Car model must be at least 3 characters long.",
      });
      setOpen(true);
      return;
    }
    if (!/^\d+$/.test(formData.price) || parseInt(formData.price) <= 0) {
      setAlert({
        type: "error",
        message: "Price must be a positive number.",
      });
      setOpen(true);
      return;
    }
    if (!/^\d{11}$/.test(formData.phone)) {
      setAlert({
        type: "error",
        message: "Phone number must be exactly 11 digits.",
      });
      setOpen(true);
      return;
    }

    setLoading(true);

    // Upload images to Vercel Blob
    const uploadedImageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        try {
          const response = await put(file.name, file, {
            access: "public",
            token:
              "vercel_blob_rw_gVmj7fwnYsqSRPoa_Bmg66DKA50V6um8tYPdCldpwGv4ZV5",
          });
          return response.url;
        } catch (error) {
          console.error("Error uploading image:", error);
          setAlert({
            type: "error",
            message: "Error uploading images to Vercel Blob.",
          });
          setOpen(true);
          throw error;
        }
      })
    );

    // Prepare data to send to backend
    const data = {
      ...formData,
      pictures: uploadedImageUrls,
    };
    console.log(uploadedImageUrls);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://car-selling-test-api.vercel.app/addcar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Error occured!");
        return;
      }
      console.log("Car entry submitted successfully:", result);
      setFormData({
        model: "",
        price: "",
        phone: "",
        maxPictures: 1,
        pictures: [],
      });
      setImageFiles([]);
      setImageURLs([]);
      setAlert({
        type: "success",
        message: "Car recorded added successfully!",
      });
      setOpen(true);
    } catch (error) {
      console.error("Error submitting car entry:", error);
      setAlert({
        type: "error",
        message: error.message || "Error submitting car entry!",
      });
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Close alert Snackbar
  const handleClose = () => {
    setOpen(false);
  };

  // Open image dialog
  const handleOpenDialog = (url) => {
    setSelectedImage(url);
    setOpenDialog(true);
  };

  // CLose image dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage("");
  };

  // Delete image from state
  const handleDeleteImage = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImageURLs((prevURLs) => prevURLs.filter((_, i) => i !== index));
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 5,
          padding: 2,
          borderRadius: 4,
        }}
      >
        <Typography component="h1" variant="h5">
          Submit Your Car
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="model"
            label="Car Model"
            name="model"
            autoComplete="model"
            autoFocus
            value={formData.model}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price"
            name="price"
            autoComplete="price"
            value={formData.price}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="max-pictures-label">
              Max Number of Pictures
            </InputLabel>
            <Select
              labelId="max-pictures-label"
              id="maxPictures"
              name="maxPictures"
              value={formData.maxPictures}
              label="Max Number of Pictures"
              onChange={handleInputChange}
            >
              {[...Array(10).keys()].map((number) => (
                <MenuItem key={number + 1} value={number + 1}>
                  {number + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ mt: 2, mb: 2 }}
          >
            Upload Pictures
            <input
              type="file"
              multiple
              hidden
              onChange={handleFileChange}
              accept="image/*"
            />
          </Button>
          {imageURLs.length > 0 && (
            <ImageList sx={{ width: "100%", height: 200 }}>
              {imageURLs.map((url, index) => (
                <ImageListItem
                  sx={{
                    margin: 1 / 8,
                  }}
                  key={index}
                >
                  <img src={url} alt={`Preview ${index}`} loading="lazy" />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      opacity: 0,
                      transition: "opacity 0.3s",
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(url)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteImage(index)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ImageListItem>
              ))}
            </ImageList>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Saving Data..." : "Submit"}
          </Button>
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={alert.type}
        >
          {alert.message}
        </MuiAlert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <img src={selectedImage} alt="Selected" style={{ width: "100%" }} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
