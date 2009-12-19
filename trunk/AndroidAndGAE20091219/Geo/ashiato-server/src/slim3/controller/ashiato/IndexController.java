package slim3.controller.ashiato;

import org.slim3.controller.Controller;
import org.slim3.controller.Navigation;

public class IndexController extends Controller {

    @Override
    public Navigation run() {
        super.requestScope("msg", "hello");
        return forward("index.jsp");
    }
}