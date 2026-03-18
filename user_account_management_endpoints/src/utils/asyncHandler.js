// Two Ways to Write asyncHandler (most used utility functions in professional Express backend industry)

// const asyncHandler = () => {}
// const asyncHandler = (fn) => {() => {}}
// const asyncHandler = (fn) => async () => {}

// Method 1 — Try Catch
/*const asyncHandler = (fn) => async (req, res, next) => {        // higher order function
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        })
    }
}*/

// Method 2 — Promise (Cleaner)
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))       // invoke promise manually
        .catch((err) => next(err));      
    }
}


export default asyncHandler;


// WITHOUT asyncHandler
// You write try-catch in EVERY route — repetitive and messy
// WITH asyncHandler
// Clean — no try-catch needed anywhere