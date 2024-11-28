export const postPingController = (req, res) => {
    console.log('consulta recibida', req.body);
    res.json(
        {
            status: 200,
            ok: true,
            message: "pong"
        }
    );
}

