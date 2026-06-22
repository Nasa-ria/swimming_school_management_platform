import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Sessions from "./pages/Sessions";
import SessionDetail from "./pages/SessionDetail";
import MyBookings from "./pages/MyBookings";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      
      {/* Swimming Sessions */}
      <Route path={"/sessions"} component={Sessions} />
      <Route path={"/sessions/:id"} component={SessionDetail} />
      <Route path={"/my-bookings"} component={MyBookings} />
      
      {/* Blog */}
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      
      {/* Shop */}
      <Route path={"/shop"} component={Shop} />
      <Route path={"/shop/category/:slug"} component={Shop} />
      <Route path={"/product/:slug"} component={ProductDetail} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      
      {/* Orders */}
      <Route path={"/orders"} component={Orders} />
      <Route path={"/orders/:id"} component={OrderDetail} />
      
      {/* Profile */}
      <Route path={"/profile"} component={Profile} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

