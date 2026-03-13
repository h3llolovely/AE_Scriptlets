/**========================================================================
 * ?                  CleanRenderQueue.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.0
 * @createdFor     :  Adobe After Effects CC
 * @description    :  Deletes all items in the Render Queue.
 *========================================================================**/

(function cleanRenderQueue(){
    var rq = app.project.renderQueue;

    for(var item = rq.numItems; item != 0; item--){
        rq.item(item).remove();
    }

})();