import { useContext } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/ui/navbar";
import LoginContext from "@/utils/contexts/login";
import { LoginComponent } from "@/components/ui/logincomponent";
import AirlineInfoCard from "@/components/ui/airwayscomponents/airlineInfoCard";
import airplaneImg from "@/assets/img/airways/airplane.jpg";
import hotAirBalloonImg from "@/assets/img/airways/hotairBalloon.jpg";
import airplaneDining from "@/assets/img/airways/airplaneDining.jpg";

interface LoginHomePageProps {
  variant: 'bank' | 'airlines' | 'market';
  name: string;
}

export default function LoginHomePage({ variant, name, ...props }: LoginHomePageProps) {

  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } =
    useContext(LoginContext);


  return (
    <motion.main
      className={`relative w-full h-screen font-audimat`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex h-20 shadow-2xl bg-ldgrey ">
        <NavBar variant="airlines" />
      </div>

      <header className={`w-full ${variant === 'bank' ? 'bg-bankblue' :
        variant === 'airlines' ? 'bg-gradient-airways' :
          variant === 'market' ? ' bg-market-header grid items-center justify-center' : ''
        } mb-[4rem]`}>
        <div
          className="w-full py-14 sm:py-[8rem] px-12 xl:px-32 2xl:px-[300px] 3xl:px-[400px] flex flex-col sm:flex-row justify-between
             items-center sm:items-start"
        >
          <div
            className="grid grid-cols-2 sm:flex flex-row sm:flex-col 
              text-white w-full sm:w-1/2 justify-start mb-4 pr-10 sm:mb-0 gap-y-10"
          >
            <p className="text-2xl lg:text-6xl xl:text-[80px] 3xl:text-[112px] font-audimat col-span-2 sm:col-span-0 w-full">
              Welcome to {name}{" "}
            </p>
            <p className="col-span-2 sm:col-span-0 text-xl lg:text-2xl 3xl:text-4xl font-sohnelight w-full">
            Launch into the skies. In the air in milliseconds, reach your destination without risk, and ship your travel dreams faster than ever before
            </p>
          </div>

          <div className="w-full sm:w-auto z-10">
            <LoginComponent
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              loginUser={loginUser}
              variant={variant}
              name={name}
            />
          </div>
        </div>
      </header>

      {variant === 'airlines' && (
        <section
          className="flex flex-col gap-y-8 sm:gap-y-8 sm:flex-row sm:gap-x-6 lg:gap-x-14
           mx-auto py-12 justify-center px-4 lg:px-8"
        >

          <AirlineInfoCard
            headerTitleText="Wheels up"
            subtitleText="You deserve to arrive refreshed, stretch out in one of our luxurious cabins."
            imgSrc={airplaneImg}
          />
          <AirlineInfoCard
            headerTitleText="Ready for an adventure"
            subtitleText="The world is open for travel. Plan your next adventure."
            imgSrc={hotAirBalloonImg}
          />
          <AirlineInfoCard
            headerTitleText="Experience luxury"
            subtitleText="Choose Launch Platinum. Select on longer flights."
            imgSrc={airplaneDining}
          />

        </section>
      )}

    </motion.main>
  )
}