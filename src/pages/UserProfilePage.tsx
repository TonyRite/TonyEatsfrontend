import { useGetMyUser, useUpdateMyUser } from "@/Api/MyUserApi";
import { UserProfileForm } from "@/forms/user-profle-form/UserProfileForm";

const UserProfilePage = () => {

    const { currentUser,isLoading:isGetLoading } = useGetMyUser();
    const {updateUser ,isLoading:isUpdateLoading} = useUpdateMyUser();

  if(isGetLoading){
    return <span>...loading</span>
   }
  if(!currentUser){
    return <span>unable to load Profile</span>
  }

  return <UserProfileForm currentUser={currentUser} onSave={updateUser} isLoading={isUpdateLoading}/>;
}

export default UserProfilePage;