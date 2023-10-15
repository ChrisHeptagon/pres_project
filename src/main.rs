use axum::{
    Server,
    response::IntoResponse,
    routing::get,
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{CorsLayer, Any};
use std::fs::File;
use std::io::Read;
use std::env::current_dir;



async fn serve_mdx() -> impl IntoResponse {
    let cwd = current_dir().expect("Could not get current directory");
    let mut file = File::open(format!("{}/astro/presentation.mdx", cwd.display())).expect("file not found");
    let mut contents = String::new();
    file.read_to_string(&mut contents).expect("something went wrong reading the file");
    println!("{}", contents);
    return contents.into_response()
}


#[tokio::main]
async fn main() {

    let backend = async {
        let app = Router::new().route("/presentation-mdx", get(serve_mdx)).layer(
            CorsLayer::new().allow_origin(Any)
        );
        serve(app, 5000).await;
    };
    backend.await;
}

async fn serve(app: Router, port: u16) {
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    Server::bind(&addr).serve(app.into_make_service()).await.unwrap();
}

