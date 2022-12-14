import React, {FC, useEffect, useState} from 'react';
import UserCard from "./UserCard";
import BaseBtn from "../UI/button/BaseBtn";
import Loader from "../UI/loader/Loader";
import {IPerson} from "../../types";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {fetchUsersDate, userSlice} from "../../store/reducer/userSlice";


const UsersList :FC= () => {
    const dispatch = useAppDispatch()
    const totalAllUsers = useAppSelector(state => state.ActionUserSlice.totalUsers)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [currentUserDate, setCurrentUserDate] = useState<IPerson[]>([])

    async function showItems ()  {
        setCurrentPage(currentPage + 1)
        const users = dispatch(fetchUsersDate(currentPage))
        const newUsers = await users.then(response => response.payload.users)
        setCurrentUserDate( [...currentUserDate, ...newUsers])
    }

    useEffect(() => {
        setCurrentPage(currentPage + 1)
        const users = dispatch(fetchUsersDate(currentPage))
        users.then(response => setCurrentUserDate(response.payload.users))
    }, [])

    useEffect(() => {
        const users = dispatch(fetchUsersDate(1))
        users.then(response => setCurrentUserDate(response.payload.users))
    }, [totalAllUsers])

    return (
        <>
            <div className='user-list'>
                <>
                    {currentUserDate.length > 0
                        ? currentUserDate.map((item:IPerson, idx:number) => <UserCard key = {idx} props={item}/>)
                        : <Loader/>
                    }
                </>
            </div>
            <>
                {
                    currentUserDate.length === totalAllUsers
                    ? null
                    : <BaseBtn
                            onClick={showItems}
                            children={'Show more'}
                        />
                }
            </>
        </>
    );
};

export default React.memo(UsersList);