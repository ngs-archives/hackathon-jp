package slim3.controller.ashiato;

import org.slim3.controller.Controller;
import org.slim3.controller.Navigation;

/**
 * これは使ってません
 */
public class IndexController extends Controller {

    @Override
    public Navigation run() {
        return forward("index.jsp");
    }
}
