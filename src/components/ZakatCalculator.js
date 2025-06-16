import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme,
} from "@mui/material";
import { AddCircleOutline, DeleteOutline, RestartAlt } from "@mui/icons-material";
import { toast } from 'react-toastify';

function ZakatCalculator() {
  const theme = useTheme();
  const [assets, setAssets] = useState([
    { id: 1, name: "Gold & Silver", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
    { id: 2, name: "Cash (Bank & Hand)", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
    { id: 3, name: "Business Stock", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
    { id: 4, name: "Investments (Shares, Bonds, etc.)", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
    { id: 5, name: "Rental Income", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
    { id: 6, name: "Agricultural Produce", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
    { id: 7, name: "Livestock (Camels, Cows, Sheep)", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
    { id: 8, name: "Real Estate for Trade", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
    { id: 9, name: "Debts Owed to You", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
    { id: 10, name: "Precious Commodities (Platinum, Diamonds, etc.)", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
  ]);

  const handleInputChange = (id, field, newValue) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) => {
        if (asset.id === id) {
          const updatedAsset = { ...asset, [field]: newValue };

          const assetValue = parseFloat(updatedAsset.value) || 0;
          const liability = parseFloat(updatedAsset.liability) || 0;

          const zakatableAmount = Math.max(assetValue - liability, 0);
          const zakat = (zakatableAmount * 2.5) / 100; // 2.5% of zakatable amount

          return {
            ...updatedAsset,
            zakatableAmount: zakatableAmount.toFixed(2),
            zakat: zakat.toFixed(2),
          };
        }
        return asset;
      })
    );
  };

  const addAsset = () => {
    setAssets((prevAssets) => [
      ...prevAssets,
      { id: Date.now(), name: "", value: "", liability: "", zakatableAmount: 0, zakat: 0 }, // Use Date.now() for unique ID
    ]);
  };

  const removeAsset = (id) => {
    setAssets((prevAssets) => prevAssets.filter((asset) => asset.id !== id));
  };

  const resetForm = () => {
    setAssets([
      { id: 1, name: "Gold & Silver", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
      { id: 2, name: "Cash (Bank & Hand)", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
      { id: 3, name: "Business Stock", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
      { id: 4, name: "Investments (Shares, Bonds, etc.)", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
      { id: 5, name: "Rental Income", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
      { id: 6, name: "Agricultural Produce", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
      { id: 7, name: "Livestock (Camels, Cows, Sheep)", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
      { id: 8, name: "Real Estate for Trade", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
      { id: 9, name: "Debts Owed to You", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
      { id: 10, name: "Precious Commodities (Platinum, Diamonds, etc.)", value: "", liability: "", zakatableAmount: 0, zakat: 0 },
    ]);
    toast.info("Form reset successfully!");
  };

  const totalAssetsValue = assets.reduce(
    (sum, asset) => sum + (parseFloat(asset.value) || 0),
    0
  ).toFixed(2);

  const totalLiabilities = assets.reduce(
    (sum, asset) => sum + (parseFloat(asset.liability) || 0),
    0
  ).toFixed(2);

  const totalZakatableAmount = assets.reduce(
    (sum, asset) => sum + (parseFloat(asset.zakatableAmount) || 0),
    0
  ).toFixed(2);

  const totalZakat = assets.reduce(
    (sum, asset) => sum + (parseFloat(asset.zakat) || 0),
    0
  ).toFixed(2);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto', my: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          mb: { xs: 3, md: 5 },
          p: { xs: 3, md: 5 },
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          boxShadow: theme.shadows[2],
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          component="div"
          sx={{
            mb: { xs: 1, md: 2 },
            fontWeight: 'fontWeightBold',
            color: theme.palette.primary.main,
            textAlign: 'center',
          }}
        >
          Zakat Calculator
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: { xs: 2, md: 3 }, textAlign: 'center', color: theme.palette.text.secondary }}
        >
          Easily calculate your Zakat obligations with our comprehensive tool.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.9,
            textAlign: 'center',
            color: theme.palette.text.secondary,
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          Zakat is a mandatory charity for Muslims, calculated as 2.5% of one's accumulated wealth above a certain threshold (Nisab).
          It purifies wealth and promotes economic justice.
        </Typography>
      </Paper>

      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mt: { xs: 4, md: 6 },
          mb: { xs: 2, md: 4 },
          fontWeight: 'fontWeightSemiBold',
          color: theme.palette.text.primary,
          textAlign: 'center',
        }}
      >
        Your Assets & Liabilities
      </Typography>

      <Grid container spacing={3}>
        {assets.map((asset) => (
          <Grid item xs={12} key={asset.id}>
            <Card
              elevation={1}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: '12px',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': { boxShadow: theme.shadows[4] },
              }}
            >
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  {typeof asset.id === 'number' && asset.id <= 10 ? (
                    <Typography variant="h6" sx={{ fontWeight: 'fontWeightMedium', color: theme.palette.text.secondary }}>
                      {asset.id}. {asset.name}
                    </Typography>
                  ) : (
                    <TextField
                      label="Asset Name"
                      value={asset.name}
                      onChange={(e) => handleInputChange(asset.id, "name", e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="medium"
                      sx={{ mr: 2, flexGrow: 1 }}
                      InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                      InputProps={{
                        style: { borderRadius: '8px' },
                      }}
                    />
                  )}
                  {typeof asset.id !== 'number' || asset.id > 10 ? (
                    <IconButton
                      onClick={() => removeAsset(asset.id)}
                      color="error"
                      aria-label="remove asset"
                      sx={{ transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.1)' } }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  ) : null}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Asset's Value (PKR)"
                      type="number"
                      fullWidth
                      value={asset.value}
                      onChange={(e) => handleInputChange(asset.id, "value", e.target.value)}
                      inputProps={{ min: "0" }}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                      InputProps={{
                        style: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Liabilities (PKR)"
                      type="number"
                      fullWidth
                      value={asset.liability}
                      onChange={(e) => handleInputChange(asset.id, "liability", e.target.value)}
                      inputProps={{ min: "0" }}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                      InputProps={{
                        style: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 0.5 }}>Zakatable Amount:</Typography>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'fontWeightBold' }}>{asset.zakatableAmount} PKR</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 0.5 }}>Zakat (2.5%):</Typography>
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 'fontWeightBold' }}>{asset.zakat} PKR</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1, md: 2 }, mt: { xs: 4, md: 6 } }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          onClick={addAsset}
          sx={{
            py: 1.5,
            px: 3,
            fontSize: { xs: '0.8rem', md: '1rem' },
            borderRadius: '8px',
            boxShadow: theme.shadows[2],
            '&:hover': { boxShadow: theme.shadows[4] },
            transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          }}
        >
          Add Custom Asset
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<RestartAlt />}
          onClick={resetForm}
          sx={{
            py: 1.5,
            px: 3,
            fontSize: { xs: '0.8rem', md: '1rem' },
            borderRadius: '8px',
            transition: 'background-color 0.3s ease-in-out',
          }}
        >
          Reset Form
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: { xs: 5, md: 8 },
          p: { xs: 3, md: 5 },
          borderRadius: '16px',
          bgcolor: theme.palette.grey[50],
          color: theme.palette.text.primary,
          textAlign: 'center',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[2],
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'fontWeightBold', color: theme.palette.primary.main, mb: { xs: 2, md: 3 } }}>
          Your Zakat Summary
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ mb: { xs: 3, md: 4 } }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ opacity: 0.8, color: theme.palette.text.secondary }}>Total Assets Value:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'fontWeightBold', color: theme.palette.text.primary }}>{totalAssetsValue} PKR</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ opacity: 0.8, color: theme.palette.text.secondary }}>Total Liabilities:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'fontWeightBold', color: theme.palette.text.primary }}>{totalLiabilities} PKR</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ opacity: 0.8, color: theme.palette.text.secondary }}>Total Zakatable Amount:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'fontWeightBold', color: theme.palette.text.primary }}>{totalZakatableAmount} PKR</Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: { xs: 3, md: 4 },
            p: { xs: 2, md: 3 },
            background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
            borderRadius: '12px',
            color: 'white',
            boxShadow: theme.shadows[4],
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'fontWeightBold' }}>Total Zakat Due</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'fontWeightBold', mt: 1 }}>{totalZakat} PKR</Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default ZakatCalculator; 