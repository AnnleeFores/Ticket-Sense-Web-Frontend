import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DatePickerSelect from "../../components/DatePickerSelect";
import Listing from "../../components/Listing";
import LoaderComponent from "../../components/LoaderComponent";
import LocationSelect from "../../components/LocationSelect";
import MovieSearch from "../../components/MovieSearch";
import Navbar from "../../components/Navbar";
import SlideControl from "../../components/SlideControl";
import TheatreSelect from "../../components/TheatreSelect";
import { useContextStore } from "../../context/AuthContext";
import Footer from "../../components/Footer";

dayjs.extend(customParseFormat);

const Index = () => {
  const {
    site,
    date,
    location,
    theater,
    setMoviedata,
    dateChange,
    setLocation,
    setTheater,
    setTheaterdata,
    setNewpost,
    user,
  } = useContextStore();

  const router = useRouter();

  const [movie, setMovie] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
  }, [user, loading]);

  if (!user) {
    return (
      <div>
        <LoaderComponent />
      </div>
    );
  }

  // convert output from calendar to date format
  const dateFormat = dayjs(date).format("YYYY-MM-DD");

  const log = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setNewpost(false);
    const loc = JSON.parse(location);
    const thea = JSON.parse(theater);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URI}api/trigger/`, {
        site: site,
        date: dateFormat,
        film: movie,
        location: loc,
        theater: thea,
        tg_user_id: user,
      })
      .then((response) => {
        if (response.data.message === "success") {
          setNewpost(true);
        }
      });

    setMovie("");
    setMoviedata([]);
    dateChange(null);
    setLocation([]);
    setTheater([]);
    setTheaterdata([{ value: "", label: "" }]);
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col mt-[70px] w-full h-full">
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center w-full max-w-[700px] gap-1">
            <form className="w-full h-full" onSubmit={log}>
              <SlideControl />
              <MovieSearch setMovie={setMovie} movie={movie} />
              <LocationSelect />
              <TheatreSelect />
              <DatePickerSelect />
              <div className="flex justify-center items-center">
                <button className=" bg-emerald-500 text-black rounded-md shadow-lg font-medium m-4 mt-8 p-3 w-[200px]">
                  Enable Ticket Sense
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="px-1 md:px-10 h-full w-full ">
          <Listing />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Index;
