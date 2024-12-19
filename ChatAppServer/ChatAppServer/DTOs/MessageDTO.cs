namespace ChatAppServer.DTOs;

public sealed record MessageDTO(
    Guid UserId,
    Guid ToUserId,
    string Message
);
