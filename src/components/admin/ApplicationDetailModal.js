import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Divider,
  IconButton,
  Stack,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
  FamilyRestroom as FamilyIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  VerifiedUser as VerifiedIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

const ApplicationDetailModal = ({ isOpen, onClose, userData }) => {

  if (!userData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderUserInfo = () => (
    <Card elevation={0} sx={{ mb: 2, backgroundColor: 'background.default' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            {userData.firstName?.[0]}{userData.lastName?.[0]}
          </Avatar>
        }
        title={
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {userData.firstName} {userData.lastName}
          </Typography>
        }
        subheader={
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={userData.verificationStatus.toUpperCase().replace(/_/g, ' ')}
              color={getStatusColor(userData.verificationStatus)}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {userData.role === 'donor' ? 'Donor' : 'Acceptor'}
            </Typography>
          </Stack>
        }
      />
      <CardContent>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <EmailIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Email" secondary={userData.email} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Phone" secondary={userData.profile?.phone || 'N/A'} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Address" 
              secondary={userData.profile?.address || 'N/A'} 
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  const renderFinancialInfo = () => (
    <Card elevation={0} sx={{ mb: 2, backgroundColor: 'background.default' }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Financial Information
          </Typography>
        }
        avatar={<MoneyIcon color="primary" />}
      />
      <CardContent>
        <List dense>
          {userData.role === 'donor' ? (
            <>
              <ListItem>
                <ListItemIcon>
                  <BusinessIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Organization" 
                  secondary={userData.profile?.organizationName || 'N/A'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WorkIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Occupation" 
                  secondary={userData.profile?.occupation || 'N/A'} 
                />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem>
                <ListItemIcon>
                  <FamilyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Family Size" 
                  secondary={userData.profile?.familySize || 'N/A'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Education" 
                  secondary={userData.profile?.education || 'N/A'} 
                />
              </ListItem>
            </>
          )}
          {userData.profile?.bankName && (
            <ListItem>
              <ListItemIcon>
                <MoneyIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Bank Name" 
                secondary={userData.profile?.bankName} 
              />
            </ListItem>
          )}
          {userData.profile?.bankAccount && (
            <ListItem>
              <ListItemIcon>
                <MoneyIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Bank Account No." 
                secondary={userData.profile?.bankAccount} 
              />
            </ListItem>
          )}
          {userData.profile?.bankCode && (
            <ListItem>
              <ListItemIcon>
                <MoneyIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Bank Code" 
                secondary={userData.profile?.bankCode} 
              />
            </ListItem>
          )}
          {userData.profile?.bankBranch && (
            <ListItem>
              <ListItemIcon>
                <MoneyIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Bank Branch" 
                secondary={userData.profile?.bankBranch} 
              />
            </ListItem>
          )}
          {userData.profile?.iban && (
            <ListItem>
              <ListItemIcon>
                <MoneyIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="IBAN" 
                secondary={userData.profile?.iban} 
              />
            </ListItem>
          )}
          {userData.profile?.swiftCode && (
            <ListItem>
              <ListItemIcon>
                <MoneyIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="SWIFT Code" 
                secondary={userData.profile?.swiftCode} 
              />
            </ListItem>
          )}
          {!userData.profile?.bankAccount && userData.profile?.easyPaisaNumber && (
            <ListItem>
              <ListItemIcon>
                <PhoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="EasyPaisa Number" 
                secondary={userData.profile?.easyPaisaNumber} 
              />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );

  const renderDocuments = () => {
    const documents = userData.profile?.documents || [];
    return (
      <Card elevation={0} sx={{ mb: 2, backgroundColor: 'background.default' }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Documents
            </Typography>
          }
          avatar={<DescriptionIcon color="primary" />}
        />
        <CardContent>
          {documents.length > 0 ? (
            <List dense>
              {documents.map((doc, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <DescriptionIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={doc.type} 
                    secondary={
                      <Button
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        View Document
                      </Button>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
              No documents provided.
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderVerificationHistory = () => {
    const history = userData.verificationHistory || [];
    return (
      <Card elevation={0} sx={{ backgroundColor: 'background.default' }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Verification History
            </Typography>
          }
          avatar={<HistoryIcon color="primary" />}
        />
        <CardContent>
          {history.length > 0 ? (
            <List dense>
              {history.map((h, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <VerifiedIcon color={getStatusColor(h.status)} />
                  </ListItemIcon>
                  <ListItemText
                    primary={h.status.toUpperCase().replace(/_/g, ' ')}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(h.timestamp).toLocaleString()}
                        </Typography>
                        {h.reason && (
                          <Typography variant="body2" color="text.secondary">
                            Reason: {h.reason}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
              No verification history available.
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 24,
        },
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'primary.main',
        color: 'white'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {userData.role === 'donor' ? 'Donor Application Details' : 'Acceptor Application Details'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderUserInfo()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderFinancialInfo()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderDocuments()}
          </Grid>
          <Grid item xs={12}>
            {renderVerificationHistory()}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: 'background.paper', justifyContent: 'flex-end' }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ mr: 1 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationDetailModal; 