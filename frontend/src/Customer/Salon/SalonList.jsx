import React, { useEffect } from "react";
import SalonCard from "./SalonCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalons } from "../../Redux/Salon/action";

const SalonList = () => {

    const dispatch = useDispatch();

    const { salon } = useSelector((store) => store);

    useEffect(() => {

        dispatch(fetchSalons());

    }, [dispatch]);

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            {(salon.salons || []).map((item) => (

                <SalonCard
                    key={item.id}
                    item={item}
                />

            ))}

        </div>

    );

};

export default SalonList;