import { Box, Grid } from "@mui/material";
import { useEffect } from "react";
import { useContext } from "react";
import PostModal from "../Components/Modals/PostModal";
import FollowersComponent from "../Components/FollowersComponent";
import FollowingComponent from "../Components/FollowingComponent";
import SuggestUser from "../Components/FriendsComponents/SuggestUser";
import HomeComponent from "../Components/HomeComponent";
import { PostContext } from "../Context/PostContext";

const HomePage = () => {
  const { setPosts, setLoading, fetchPost } = useContext(PostContext);

  useEffect(() => {
    fetchPost()
      .then((res) => {
        if (res.data.success == true) {
          const p = [...res.data.posts];
          setPosts([...p]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Grid container>
          <Grid
            item
            margin="20px auto"
            xs={3}
            sx={{
              backgroundColor: "#CAD1C9",
              height: "92vh",
            }}
          >
            <Box maxWidth="300px" margin="auto">
              <FollowersComponent />
            </Box>
            <Box maxWidth="300px" margin="auto">
              <FollowingComponent />
            </Box>
          </Grid>
          <Grid
            className="hidenScrollBar"
            item
            xs={6}
            sx={{
              backgroundColor: "#EFF4ED",
              overflowY: "scroll",
              height: "92vh",
            }}
          >
            <HomeComponent />
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              backgroundColor: "#CAD1C9",
              height: "92vh",
            }}
          >
            <Box
              maxWidth="90%"
              margin="20px auto"
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
              }}
            >
              <PostModal />
            </Box>
            <Box
              maxWidth="fit-content"
              margin="20px auto"
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                height: "70vh",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              <SuggestUser />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <HomeComponent />
      </Box>
    </>
  );
};

export default HomePage;
