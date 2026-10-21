package com.example.twitterclient.network;

import android.content.Context;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import org.json.JSONObject;

/** Android emulator -> Windows host; change for physical devices/deployment. */
public class ApiService {
    private static final String BASE_URL = "http://10.0.2.2:3000";
    private final RequestQueue queue;

    public ApiService(Context context) {
        queue = Volley.newRequestQueue(context.getApplicationContext());
    }

    public void getPosts(Response.Listener<JSONObject> success,
                         Response.ErrorListener failure) {
        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET, BASE_URL + "/api/posts", null, success, failure);
        queue.add(request);
    }

    public void createPost(JSONObject body, Response.Listener<JSONObject> success,
                           Response.ErrorListener failure) {
        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.POST, BASE_URL + "/api/posts", body, success, failure);
        queue.add(request);
    }
}
