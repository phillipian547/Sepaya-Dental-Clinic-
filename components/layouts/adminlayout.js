import { signOut } from "next-auth/react"
import Link from "next/link"

export default function AdminLayout({children}) {
  
  const doSignout = async(event) => {
    event.preventDefault();

    const result = await signOut({redirect: true, callbackUrl: "/login"});

    //console.log(result);
  };
  
  return(
    <>
      <div>
        <div>
          <header>
            <h1>Sepaya Dental Scheduling System <Link href="/" onClick={doSignout}>Signout</Link></h1>                                                                  
          </header>
        </div>
      </div>

      <div>
        <div>
          <main>{children}</main>
        </div>
      </div>
      
      <div>
        <div>
          <footer>
            <p>Copyright &copy; Sepaya Dental Scheduling System</p>
          </footer>
        </div>
      </div>
    </>

  )
}