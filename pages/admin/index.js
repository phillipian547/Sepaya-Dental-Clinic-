import { useSession } from "next-auth/react";
import GeneralLayout from "../../components/layouts/generallayout";
import AdminComponent from "../../components/admin-component/admin.component";
import UserComponent from "../../components/user.component/user.component";

function Admin() {

  const { data: session, status } = useSession();

 
  if(session) {
    const role = session.user.role;
    const userId = session.user.userId;
    //console.log(session);
  
    return (
      <>
        { role === 'admin' &&
          <AdminComponent></AdminComponent>
        }

        { role === 'user' &&
          <UserComponent userId={userId} ></UserComponent>
        }
        
      </>
    )
  }

 
};


Admin.layout = GeneralLayout;
export default Admin;