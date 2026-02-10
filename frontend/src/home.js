// home.js (Glass UI + severity badges + remedies)
import {
  AppBar,
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Toolbar,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { DropzoneArea } from "material-ui-dropzone";
import { useEffect, useState } from "react";
import bgImage from "./bg.png";
import cblogo from "./cblogo.PNG";

// Disease information
const diseaseInfo = {
  Healthy: {
    description: "Leaf is normal and disease-free.",
    remedy: "No action needed. Continue regular monitoring.",
    severity: "low",
  },
  "Late Blight": {
    description: "Caused by Phytophthora infestans. Large, dark lesions.",
    remedy: "Remove infected plants, use fungicide, avoid wet conditions.",
    severity: "high",
  },
  "Early Blight": {
    description: "Brown spots with yellow edges and concentric rings.",
    remedy: "Remove affected leaves, rotate crops, fungicide if necessary.",
    severity: "medium",
  }
};

// ---------------- GLASS UI STYLES ----------------
const useStyles = makeStyles(() => ({
  mainContainer: {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    minHeight: "100vh",
    paddingTop: "20px",
  },

  glassCard: {
    background: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(14px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    padding: "16px",
  },

  glassButton: {
    background: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "12px",
    backdropFilter: "blur(6px)",
    fontWeight: 700,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
  },

  severityTagLow: {
    background: "#4caf50",
    color: "white",
    padding: "3px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 700,
    display: "inline-block",
  },
  severityTagMed: {
    background: "#ff9800",
    color: "white",
    padding: "3px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 700,
    display: "inline-block",
  },
  severityTagHigh: {
    background: "#f44336",
    color: "white",
    padding: "3px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 700,
    display: "inline-block",
  },
}));

const severityBadge = (severity, classes) => {
  if (severity === "high") return <span className={classes.severityTagHigh}>HIGH</span>;
  if (severity === "medium") return <span className={classes.severityTagMed}>MEDIUM</span>;
  return <span className={classes.severityTagLow}>LOW</span>;
};

// -----------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------
export const ImageUpload = () => {
  const classes = useStyles();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  useEffect(() => {
    return () => {
      selectedFiles.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
    };
  }, []);

  // Handle file selection
  const onSelectFiles = (files) => {
    const list = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles(list);
    setResults([]);
  };

  // Predict API
  const sendFiles = async () => {
    if (!selectedFiles.length) return;

    setIsUploading(true);

    const output = [];

    try {
      for (const item of selectedFiles) {
        const formData = new FormData();
        formData.append("file", item.file);

        const res = await axios.post(process.env.REACT_APP_API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const data = res.data;

        output.push({
          imageUrl: item.preview,
          label: data.class,
          confidence: (data.confidence * 100).toFixed(2),
        });
      }

      setResults(output);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <AppBar style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Potato Disease Classifier
          </Typography>
          <Avatar src={cblogo} />
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container className={classes.mainContainer}>

        <Grid container justify="center">
          <Grid item xs={12} md={6}>
            <Card className={classes.glassCard}>

              <CardContent>
                <DropzoneArea
                  acceptedFiles={["image/*"]}
                  dropzoneText={"Drag & drop potato leaf images"}
                  onChange={onSelectFiles}
                  filesLimit={20}
                />
              </CardContent>

              {selectedFiles.length > 0 && (
                <CardContent>
                  <Button className={classes.glassButton} onClick={sendFiles}>
                    Predict
                  </Button>
                </CardContent>
              )}

              {isUploading && (
                <CardContent>
                  <CircularProgress />
                </CardContent>
              )}

              {/* Results */}
              {results.length > 0 && (
                <CardContent>
                  <Typography variant="h6">Results</Typography>

                  <Grid container spacing={2} style={{ marginTop: 8 }}>
                    {results.map((r, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Card className={classes.glassCard}>
                          <CardMedia style={{ height: 150 }} image={r.imageUrl} />

                          <CardContent>
                            <Typography variant="subtitle1"><b>{r.label}</b></Typography>
                            <Typography>Confidence: {r.confidence}%</Typography>

                            {/* Severity Tag */}
                            <div style={{ marginTop: 8 }}>
                              {severityBadge(diseaseInfo[r.label]?.severity, classes)}
                            </div>

                            {/* Description */}
                            <Typography style={{ marginTop: 10, fontWeight: "bold" }}>
                              Description
                            </Typography>
                            <Typography>
                              {diseaseInfo[r.label]?.description}
                            </Typography>

                            {/* Remedy */}
                            <Typography style={{ marginTop: 10, fontWeight: "bold" }}>
                              Remedy
                            </Typography>
                            <Typography>
                              {diseaseInfo[r.label]?.remedy}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
